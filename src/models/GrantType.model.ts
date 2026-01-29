import sequelize from "@/config/db.config";
import { Model, Optional, DataTypes } from "sequelize";
import { UUID } from "@/utils/uuid.util";

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
      type: DataTypes.STRING,
      primaryKey: true,
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
    hooks: {
      beforeCreate: (data) => {
        data.id = UUID.v7();
      },
    },
  }
);

export default GrantType;
