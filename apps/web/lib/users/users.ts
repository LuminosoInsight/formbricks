import { hashPassword } from "../auth";

export const createUser = async (
  name: string,
  email: string,
  password: string,
  inviteToken?: string | null,
  webAppUrl?: string
): Promise<any> => {
  const hashedPassword = await hashPassword(password);
  try {
    const fetchUrl = webAppUrl ? `${webAppUrl}/api/v1/users` : `/api/v1/users`;
    console.log("fetchUrl: ", fetchUrl);
    console.log(
      "Create user body: ",
      JSON.stringify({
        name,
        email,
        password: hashedPassword,
        inviteToken,
        onboardingCompleted: false,
      })
    );

    const res = await fetch(fetchUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password: hashedPassword,
        inviteToken,
        onboardingCompleted: false,
      }),
    });
    console.log("res: ", res);
    if (res.status !== 200) {
      const json = await res.json();
      console.log("Error: ", json);
      throw Error(json.error);
    }
    const jsonedRes = await res.json();
    console.log(jsonedRes);
    return jsonedRes;
  } catch (error: any) {
    throw Error(`${error.message}`);
  }
};

export const resendVerificationEmail = async (email: string): Promise<any> => {
  try {
    const res = await fetch(`/api/v1/users/verification-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
      }),
    });
    if (res.status !== 200) {
      const json = await res.json();
      throw Error(json.error);
    }
    return await res.json();
  } catch (error: any) {
    throw Error(`${error.message}`);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const res = await fetch(`/api/v1/users/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
      }),
    });
    if (res.status !== 200) {
      const json = await res.json();
      throw Error(json.error);
    }
    return await res.json();
  } catch (error: any) {
    throw Error(`${error.message}`);
  }
};

export const resetPassword = async (token: string, password: string): Promise<any> => {
  const hashedPassword = await hashPassword(password);
  try {
    const res = await fetch(`/api/v1/users/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        hashedPassword,
      }),
    });
    if (res.status !== 200) {
      const json = await res.json();
      throw Error(json.error);
    }
    return await res.json();
  } catch (error: any) {
    throw Error(`${error.message}`);
  }
};

export const deleteProfile = async (): Promise<any> => {
  try {
    const res = await fetch("/api/v1/users/me/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (res.status !== 200) {
      const json = await res.json();
      throw Error(json.error);
    }
    return await res.json();
  } catch (error) {
    throw Error(`${error.message}`);
  }
};
