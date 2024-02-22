const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel")

//@desc Get all contacts
//@route GET /api/contacts
//@access private

const getContacts = asyncHandler(async(req, res) =>{
  const contacts = await Contact.find({user_id: req.user.id})
  res.status(200).json(contacts)
});



//@desc Create New contact
//@route POST /api/contacts
//@access private

const createContact = asyncHandler(async(req, res) =>{
  console.log("request of the body is", req.body);
  const {name, mail, address, phone} = req.body;
  if(!name || !mail || !phone || !address){
    res.status(400);
    throw new Error("All fields are mandatory")
  }
  const contact = await Contact.create({
    name,
    mail,
    address,
    phone,
    user_id: req.user.id
  });
  res.status(201).json(contact)
});


//@desc Get contact
//@route GET /api/contacts
//@access private

const getContact = asyncHandler(async(req, res) =>{
  const contact = await Contact.findById(req.params.id)

  if(!contact){
    res.status(404);
    throw new Error("Contact not found")
  }
  res.status(200).json(contact);
});


//@desc Update contact
//@route PUT /api/contacts
//@access private

const updateContact = asyncHandler(async(req, res) =>{
  const contact = await Contact.findById(req.params.id)

  if(!contact){
    res.status(404);
    throw new Error("Contact not found")
  }

  if(contact.user_id.toString() !== req.user.id){
    res.status(403);
    throw new Error("User dont have permission to update contact")
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new: true}
  );
  res.status(200).json(updatedContact)
});


//@desc Delete contact
//@route DELETE /api/contacts
//@access private

const deleteContact = asyncHandler(async(req, res) =>{
  const contact = await Contact.findById(req.params.id)

  if(!contact){
    res.status(404);
    throw new Error("Contact not found")
  }

  if(contact.user_id.toString() !== req.user.id){
    res.status(403);
    throw new Error("User dont have permission to update contact")
  }
  
  await Contact.deleteOne(req.params.id)
  res.status(200).json(contact)
});









module.exports = {getContacts, createContact, getContact, updateContact, deleteContact};