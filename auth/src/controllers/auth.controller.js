const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../db/redis");
const { body, validationResult } = require('express-validator');
const { publishToQueue } = require("../broker/broker");

async function registerUser(req, res) {
  const {
    username,
    email,
    password,
    fullName: { firstName, lastName },role
  } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    return res.status(402).json({ message: "User or email already exist" });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
    fullName: {
      firstName,
      lastName,
    },
    role: role || 'user'
  });

  await Promise.all([
    publishToQueue('AUTH_NOTIFICATION.USER_CREATED',{
    id: user._id,
    username: user.username,
    email:user.email,
    fullName: user.fullName,
    }),
    publishToQueue("AUTH_SELLER_DASHBOARD.USER_CREATED", user)
  ]) 
    
  


  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "User registered Succsefully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      address: user.addresses,
    },
  });
}

async function loginUser(req, res) {
  const { username, email, password } = req.body;

  const user = await userModel
    .findOne({ $or: [{ email }, { username }] })
    .select("+password");

  if (!user) {
    return res
      .status(401)
      .json({ message: "Invalid username and email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  });
}

async function getCurrentUser(req, res) {
  return res.status(200).json({
    message: "User profile retrieved successfully",
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      fullName: req.user.fullName,
      role: req.user.role,
      addresses: req.user.addresses,
    },
  });
}

async function logoutUser(req, res) {
  const token = req.cookies?.token;

  if (token) {
    await redis.set(`blacklist:${token}`, "true", "EX", 24 * 60 * 60);
  }

  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    maxAge: 0,
  });

  return res.status(200).json({
    message: "Logout successful",
  });
}

async function getUserAddresses(req,res){
  const id = req.user.id
  const user = await userModel.findById(id).select('addresses')
  if(!user){
    return res.status(404).json({
      message:"User not found"
    })
  }

  return res.status(200).json({
    message:"User addresses fetched successfuly",
    addresses: user.addresses
  })
}

async function addUserAddresses(req, res) {

  const user = await userModel.findById(req.user.id);

  const addressData = req.body;

  // First address default
  if (user.addresses.length === 0) {
    addressData.default = true;
  }

  // If current address default=true
  if (addressData.default === true) {

    user.addresses.forEach((addr) => {
      addr.default = false;
    });

  }

  user.addresses.push(addressData);

  await user.save();

  const addedAddress =
    user.addresses[user.addresses.length - 1];

  return res.status(201).json({
    message: "Address added successfully",
    address: addedAddress,
  });

}

async function deleteUserAddress(req, res) {

  const id = req.user.id;

  const { addressId } = req.params;

  const user = await userModel.findOneAndUpdate(
    { _id: id },
    {
      $pull: {
        addresses: { _id: addressId },
      },
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const addressExists = user.addresses.some(
    (addr) => addr._id.toString() === addressId
  );

  if (addressExists) {
    return res.status(500).json({
      message: "Failed to delete address",
    });
  }

  return res.status(200).json({
    message: "Address deleted successfully",
    addresses: user.addresses,
  });

}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  getUserAddresses,
  addUserAddresses,
  deleteUserAddress
};
