import sequelize from "@/config/db.config";
import { Model, Optional, DataTypes } from "sequelize";
import crypto from "crypto";

type AuthorizationCodeAttributes = {
  code: string;
  client_id: string;
  user_id: string;
  scope: string;
  redirect_uri: string;
  expiresAt: Date;
  sessionId?: string;
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
  declare sessionId?: string;
  declare expiresAt: Date;
}

AuthorizationCode.init(
  {
    code: {
      type: DataTypes.STRING(64),
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
    sessionId: {
      type: DataTypes.STRING,
      allowNull: true,
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
    hooks: {
      beforeCreate: (authorizationCode) => {
        authorizationCode.code = crypto.randomBytes(32).toString("hex");
      },
    },
  }
);

export default AuthorizationCode;
