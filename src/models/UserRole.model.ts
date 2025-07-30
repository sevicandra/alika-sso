import sequelize from "@/config/db.config";
import { Model, DataTypes } from "sequelize";

type UserRoleAttributes = {
  userId: string;
  role_kode: string;
};

class UserRole extends Model<UserRoleAttributes> implements UserRoleAttributes {
  public userId!: string;
  public role_kode!: string;
}

UserRole.init(
  {
    userId: {
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