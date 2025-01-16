import { prisma } from "./prisma";

export async function createUser(email: string, password: string) {
  try {
    return await prisma.user.create({
      data: {
        email,
        password
      }
    })
  } catch (error) {
    console.log("Error creating user:", error);
  }
}

export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findFirst({
      where: {
        email
      }
    })
  } catch (error) {
    console.log("Error fetching user:", error);
  }
}