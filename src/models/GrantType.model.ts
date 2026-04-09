import { DataTypes, Model, Optional } from "sequelize";
import { UUID } from "@/utils/uuid.util";
import sequelize from "@/config/db.config";

type GrantTypeAttributes = {
  id: string;
  kode: string;
  grant: string;
};
type GrantTypeCreationAttributes = Optional<GrantTypeAttributes, "id">;
class GrantType
  extends Model<GrantTypeAttributes, GrantTypeCreationAttributes>
  implements GrantTypeAttributes
{
  public id!: string;
  public kode!: string;
  public grant!: string;
}

GrantType.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUID.v7,
    },
    kode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    grant: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "grant_types",
    timestamps: false,
    modelName: "GrantType",
    defaultScope: {
      order: [["kode", "ASC"]],
    },
  }
);

export default GrantType;
