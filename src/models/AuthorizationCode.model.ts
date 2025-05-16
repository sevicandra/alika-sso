import sequelize from "@/config/db.config";
import { Model, Optional, DataTypes, Op } from "sequelize";

type AuthorizationCodeAttributes = {
  code: string;
  client_id: string;
  user_id: string;
  scope: string;
  redirect_uri: string;
  expiresAt: Date;
};

type AuthorizationCodeCreationAttributes = Optional<
  AuthorizationCodeAttributes,
  "code"
>;

class AuthorizationCode extends Model<
  AuthorizationCodeAttributes,
  AuthorizationCodeCreationAttributes
> {
  declare code: string;
  declare client_id: string;
  declare user_id: string;
  declare scope: string;
  declare redirect_uri: string;
  declare expiresAt: Date;
}

AuthorizationCode.init(
  {
    code: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Clients",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    redirect_uri: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "authorization_codes",
    timestamps: false,
    modelName: "AuthorizationCode",
  }
);

export default AuthorizationCode;
