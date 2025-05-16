import sequelize from "@/config/db.config";
import { Model, Optional, DataTypes } from "sequelize";
import { UUID } from "@/utils/uuid.util";

type GlobalRoleAttributes = {
  id: string;
  kode: string;
  role: string;
  description: string;
};

type GlobalRoleCreationAttributes = Optional<GlobalRoleAttributes, "id">;

class GlobalRole
  extends Model<GlobalRoleAttributes, GlobalRoleCreationAttributes>
  implements GlobalRoleAttributes
{
  public id!: string;
  public kode!: string;
  public role!: string;
  public description!: string;
}

GlobalRole.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    kode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "GlobalRoles",
    tableName: "global_roles",
    timestamps: false,
    hooks: {
      beforeCreate: (data) => {
        data.id = UUID.v7();
      },
    }
  }
);

export default GlobalRole;
