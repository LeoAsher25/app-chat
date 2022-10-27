import { registerDecorator, ValidationOptions } from 'class-validator';
import mongoose from 'mongoose';

export const IsObjectId = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsObjectId',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: {
        message: validationOptions?.each
          ? '$property is not a valid ObjectId array'
          : '$property is not a valid ObjectId',
        ...validationOptions,
      },
      validator: {
        validate(value: any): boolean {
          return (
            typeof value === 'string' && mongoose.Types.ObjectId.isValid(value)
          );
        },
      },
    });
  };
};
