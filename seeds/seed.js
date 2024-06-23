// seeds/seed.js
const connectDB = require("../config/db");
const Organization = require("../models/Organization");
const User = require("../models/User");
const Role = require("../models/Role");
const faker = require("faker");

const seed = async () => {
  await connectDB();

  const organizations = [];
  for (let i = 0; i < 5; i++) {
    const organization = new Organization({
      name: faker.company.companyName(),
      description: faker.company.catchPhrase(),
    });
    await organization.save();
    organizations.push(organization);
  }

  const roles = [
    {
      name: "admin",
      privileges: ["view all data", "edit all data", "delete all data"],
    },
    { name: "user", privileges: ["view own data", "edit own data"] },
  ];

  for (let i = 0; i < roles.length; i++) {
    const role = new Role(roles[i]);
    await role.save();
  }

  const droles = await Role.find();

  for (let i = 0; i < 5; i++) {
    const user = new User({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: droles[Math.floor(Math.random() * roles.length)]._id,
      organization:
        organizations[Math.floor(Math.random() * organizations.length)]._id,
    });
    await user.save();
  }

  console.log("Seeding completed.");
  process.exit();
};

seed();
