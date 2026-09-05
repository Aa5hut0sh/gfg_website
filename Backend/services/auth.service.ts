import User from './../models/User.model'
type Role = "USER"|"ADMIN";


export const createUser = async (email: string, hashedPassword: string, name?: string , role?:Role) => {
  try {
    const user = await User.create({
      email,
      hashedPassword,
      name,
      role,
    });

    return user;
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      throw new Error("Email already exists");
    }
    throw error;
  }
};


export const findUserByEmail = async (email:string) => {
  return await User.findOne({ email });
};

export const findUserById = async (id :string) => {
  return await User.findById(id);
};


export const findOrCreateOAuthUser = async (profile :{id :string , email:string , name?:string} , provider: 'google') => {
  let user = await User.findOne({ googleId: profile.id })

  if (user) return user;

  const existingUser = await User.findOne({ email: profile.email });

  if (existingUser) {
    existingUser.googleId = profile.id;
    await existingUser.save();
    return existingUser;
  }

  const newUser = await User.create({
    email: profile.email,
    name: profile.name,
    googleId: profile.id,
    hashedPassword: null,
  });

  return newUser;
};


export const updateUser = async (id: string, data: { name?: string }) => {
  return await User.findByIdAndUpdate(id, data, {
    new: true,
  })
};

export const updatePassword = async ({id, newHashedPassword}:{id:string , newHashedPassword :string}) => {
  return await User.findByIdAndUpdate(id, {
    hashedPassword: newHashedPassword,
  });
};