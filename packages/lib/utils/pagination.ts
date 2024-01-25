export type Pagination = {
  page?: number;
  perPage?: number;
};

export const getPaginatedPrismaResult = async (
  pagination: Pagination,
  modelData: { model: any; args: any },
  defaultPerPage = 10
) => {
  const page = pagination.page ? +pagination.page : 1;
  const perPage = pagination.perPage ? +pagination.perPage : defaultPerPage;

  const skip = (page - 1) * perPage;

  const [total, data] = await Promise.all([
    modelData.model.count({ where: modelData.args.where }),
    modelData.model.findMany({
      ...modelData.args,
      take: perPage,
      skip,
    }),
  ]);

  const lastPage = Math.ceil(total / perPage);

  return {
    data,
    meta: {
      total,
      lastPage,
      page,
      perPage,
    },
  };
};
