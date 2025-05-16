import sequelize from "@/config/db.config";
import { Model, Optional, DataTypes, Op } from "sequelize";
import Client from "./Client.model";
import { UUID } from "@/utils/uuid.util";
type RedirectUriAttributes = {
  id: string;
  clientId: string;
  uri: string;
};
type RedirectUriCreationAttributes = Optional<RedirectUriAttributes, "id">;
class RedirectUri
  extends Model<RedirectUriAttributes, RedirectUriCreationAttributes>
  implements RedirectUriAttributes
{
  public id!: string;
  public clientId!: string;
  public uri!: string;
}

RedirectUri.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Client,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    uri: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      }
    },
  },
  {
    sequelize,
    tableName: "redirect_uris",
    timestamps: false,
    modelName: "RedirectUri",
    hooks: {
      beforeCreate: (data) => {
        data.id = UUID.v7();
      },
    }
  }
);

export default RedirectUri;
