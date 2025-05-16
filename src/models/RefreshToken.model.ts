import sequelize from "@/config/db.config";
import { Model, Optional, DataTypes, Op } from "sequelize";
import { UUID } from "@/utils/uuid.util";
import { hash } from "@/utils/crypt.util";

type RefreshTokenAttributes = {
  id?: string;
  token: string;
  userId: string | null;
  clientId: string;
  expiresAt: Date;
  scope: string;
};

type RefreshTokenCreationAttributes = Optional<RefreshTokenAttributes, "id">;

class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  implements RefreshTokenAttributes
{
  declare id: string;
  declare token: string;
  declare userId: string | null;
  declare clientId: string;
  declare expiresAt: Date;
  declare scope: string;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    clientId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Clients",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "RefreshToken",
    tableName: "refresh_tokens",
    hooks: {
      beforeCreate: (data) => {
        data.id = UUID.v7();
      },
      afterValidate: async (token: RefreshToken) => {
        token.token = await hash(token.token);
      },
    },
  }
);

export default RefreshToken;
