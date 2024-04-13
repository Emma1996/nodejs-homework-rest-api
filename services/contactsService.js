const Contact = require("../models/contacts");
const getAllContacts = async (userId, query) => {
  const {
    page = 1,
    limit = 20,
    offset = (page - 1) * limit,
    sortBy,
    sortByDesc,
    filter,
    favorite = null,
  } = query;

  const params = { owner: userId };

  if (favorite !== null) {
    params.favorite = favorite;
  }

  const result = await Contact.paginate(params, {
    page,
    limit,
    offset,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
    select: filter ? filter.split("|").join(" ") : "",
    populate: { path: "owner", select: "email subscription" },
  });

  const { docs: contacts, totalDocs: total, totalPages } = result;

  return {
    contacts,
    total,
    totalPages,
    page: Number(page),
    limit: Number(limit),
    offset: Number(offset),
  };
};

const getContactById = async (userId, contactId) => {
  const contact = await Contact.findOne({
    _id: contactId,
    owner: userId,
  })
    .populate({ path: "owner", select: "email subscription" })
    .select({ __v: 0 });
  return contact;
};

const addContact = async (userId, body) => {
  const newContact = await Contact.create({ ...body, owner: userId });
  return newContact;
};

const updateContact = async (userId, contactId, body) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    body,
    { new: true }
  )
    .populate({ path: "owner", select: "email subscription" })
    .select({ __v: 0 });
  return updatedContact;
};

const updateContactStatus = async (userId, contactId, { favorite }) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { favorite },
    { new: true }
  )
    .populate({ path: "owner", select: "email subscription" })
    .select({ __v: 0 });
  return updatedContact;
};

const removeContact = async (userId, contactId) => {
  const contact = await Contact.findOneAndRemove({
    _id: contactId,
    owner: userId,
  });
  return contact;
};

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  updateContactStatus,
  removeContact,
};
