import sequelize from "@/config/db.config";
import { Model, DataTypes } from "sequelize";

type UserRoleAttributes = {
  user_id: string;
  role_kode: string;
};

class UserRole extends Model<UserRoleAttributes> implements UserRoleAttributes {
  public user_id!: string;
  public role_kode!: string;
}

UserRole.init(
  {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    role_kode: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: "user_roles",
    modelName: "UserRole",
    timestamps: false,
  }
);

export default UserRole;
