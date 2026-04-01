import sequelize from "@/config/db.config";
import { Model, DataTypes, Optional } from "sequelize";
import { Client } from "@/models";
import { Grant } from "@/models";
import { UUID } from "@/utils/uuid.util";

type ClientGrantAttributes = {
  id: string;
  client_id: string;
  grant_kode: string;
};

type ClientGrantCreationAttributes = Optional<ClientGrantAttributes, "id">;

class ClientGrant
  extends Model<ClientGrantAttributes, ClientGrantCreationAttributes>
  implements ClientGrantAttributes
{
  public id!: string;
  public client_id!: string;
  public grant_kode!: string;

  public Client!: Client;
  public Grant!: Grant;
}
ClientGrant.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUID.v7,
    },
    client_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    grant_kode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ClientGrant",
    tableName: "client_grant_types",
    indexes: [
      {
        unique: true,
        fields: ["client_id", "grant_kode"],
        name: "client_grant_type",
      },
    ],
  }
);

export default ClientGrant;
