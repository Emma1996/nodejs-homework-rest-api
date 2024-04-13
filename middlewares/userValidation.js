const Joi = require("joi");
const { SubTypes } = require("../helpers/constants");

const schemaRegLogUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "ro", "de", "gov", "ca"] },
    })
    .pattern(
      /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
    )
    .required(),
  password: Joi.string()
    .pattern(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/)
    .required(),
  subscription: Joi.string().default(SubTypes.STARTER),
});

const schemaSubscriptionUser = Joi.object({
  subscription: Joi.any()
    .valid(SubTypes.STARTER, SubTypes.PRO, SubTypes.BUSINESS)
    .required(),
});

const validate = (schema, res, req, next) => {
  const validationBody = schema.validate(req.body);

  if (validationBody.error) {
    return res
      .status(400)
      .json({ message: validationBody.error.message.replace(/"/g, "") });
  }
  next();
};

module.exports = {
  regLogValidation: (req, res, next) => {
    return validate(schemaRegLogUser, res, req, next);
  },
  subscriptionValidation: (req, res, next) => {
    return validate(schemaSubscriptionUser, res, req, next);
  },
};
