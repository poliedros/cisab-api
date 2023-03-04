import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { Types as MongooseTypes } from 'mongoose';

export function IsObjectId(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  validationOptions = {
    ...validationOptions,
    message: 'ObjectId is not valid.',
  };

  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return MongooseTypes.ObjectId.isValid(value);
        },
      },
    });
  };
}
