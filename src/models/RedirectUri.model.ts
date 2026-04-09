import { DataTypes, Model, Optional } from "sequelize";
import { UUID } from "@/utils/uuid.util";
import sequelize from "@/config/db.config";
import Client from "./Client.model";

type RedirectUriAttributes = {
  id: string;
  client_id: string;
  uri: string;
};
type RedirectUriCreationAttributes = Optional<RedirectUriAttributes, "id">;
class RedirectUri
  extends Model<RedirectUriAttributes, RedirectUriCreationAttributes>
  implements RedirectUriAttributes
{
  public id!: string;
  public client_id!: string;
  public uri!: string;
}

RedirectUri.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUID.v7,
    },
    client_id: {
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
        isUrl: {
          msg: "Url tidak valid",
        },
        notEmpty: {
          msg: "Url harus diisi",
        },
        notNull: {
          msg: "Url harus diisi",
        },
      },
    },
  },
  {
    sequelize,
    tableName: "redirect_uris",
    timestamps: false,
    modelName: "RedirectUri",
  }
);

export default RedirectUri;
