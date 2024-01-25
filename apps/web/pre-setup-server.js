const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const { randomBytes, createHash } = require("crypto");

async function hashPassword(password) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

const EventType = {
  code: "code",
  noCode: "noCode",
  automatic: "automatic",
};

const populateEnvironment = {
  eventClasses: [
    {
      name: "New Session",
      description: "Gets fired when a new session is created",
      type: EventType.automatic,
    },
    {
      name: "Exit Intent (Desktop)",
      description: "A user on Desktop leaves the website with the cursor.",
      type: EventType.automatic,
    },
    {
      name: "50% Scroll",
      description: "A user scrolled 50% of the current page",
      type: EventType.automatic,
    },
  ],
  attributeClasses: [
    { name: "userId", description: "The internal ID of the person", type: EventType.automatic },
    { name: "email", description: "The email of the person", type: EventType.automatic },
  ],
};

const prisma = new PrismaClient();

const createEnvironment = async (productId, environmentInput) => {
  return await prisma.environment.create({
    data: {
      type: environmentInput.type || "development",
      product: { connect: { id: productId } },
      widgetSetupCompleted: environmentInput.widgetSetupCompleted || false,
      eventClasses: {
        create: populateEnvironment.eventClasses,
      },
      attributeClasses: {
        create: populateEnvironment.attributeClasses,
      },
    },
  });
};

const updateProduct = async (productId, inputProduct) => {
  const { environments, ...data } = inputProduct;
  return await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      ...data,
      environments: {
        connect: environments?.map((environment) => ({ id: environment.id })) ?? [],
      },
    },
    include: {
      environments: true,
    },
  });
};

const createProduct = async (teamId, productInput) => {
  const { environments, ...data } = productInput;

  let product = await prisma.product.create({
    data: {
      ...data,
      name: productInput.name,
      teamId,
    },
  });

  const devEnvironment = await createEnvironment(product.id, {
    type: "development",
  });

  const prodEnvironment = await createEnvironment(product.id, {
    type: "production",
  });

  product = await updateProduct(product.id, {
    environments: [devEnvironment, prodEnvironment],
  });

  return product;
};

const createMembership = async (teamId, userId, data) => {
  const membership = await prisma.membership.create({
    data: {
      userId,
      teamId,
      accepted: data.accepted,
      role: data.role,
    },
  });
};

const createApiKey = async (environmentId) => {
  const apiKeyData = {
    label: "ApiKey",
  };
  const hashApiKey = (key) => createHash("sha256").update(key).digest("hex");
  const key = process.env.FORMBRICKS_TOKEN;
  const hashedKey = hashApiKey(key);

  const result = await prisma.apiKey.create({
    data: {
      ...apiKeyData,
      hashedKey,
      environment: { connect: { id: environmentId } },
    },
  });
};

async function main() {
  const existedUsers = await prisma.user.findMany();
  if (existedUsers.length) return;

  const hashedPassword = await hashPassword(process.env.FORMBRICKS_PASSWORD);

  const newUser = {
    email: "lumi-admin@email.com",
    name: "lumi-admin",
    password: hashedPassword,
  };

  const team = await prisma.team.create({
    data: {
      name: `${newUser.name}'s Team`,
    },
  });

  const newProduct = await createProduct(team.id, { name: "Lumi Surveys" });

  const profile = await prisma.user.create({
    data: newUser,
  });

  await createMembership(team.id, profile.id, { role: "owner", accepted: true });

  console.log("User successfully created:", newUser.email);

  const apiKey = await createApiKey(newProduct.environments[1].id);

  console.log("Api key created!");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
