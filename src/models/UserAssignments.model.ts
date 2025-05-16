import sequelize from "@/config/db.config";
import {
  Model,
  Optional,
  DataTypes,
  BelongsTo,
  BelongsToMany,
} from "sequelize";
import { hash } from "@/utils/crypt.util";
import User from "./User.model";
import Role from "./Role.model";
import { UUID } from "@/utils/uuid.util";

type UserAssignmentsAttributes = {
  id: string;
  password: string;
  nip: string;
  kd_satker: string;
  nama: string;
};
type UserAssignmentsRoleAttributes = {
  userId: string;
  role: string;
};
type UserAssignmentsCreationAttributes = Optional<UserAssignmentsAttributes, "id" | "password">;
export class UserAssignments
  extends Model<UserAssignmentsAttributes, UserAssignmentsCreationAttributes>
  implements UserAssignmentsAttributes
{
  public id!: string;
  public password!: string;
  public nip!: string;
  public kd_satker!: string;
  public nama!: string;

  public Roles!: Role[] | [];
  public UserInfo!: User | null;

  public static associations: {
    User: BelongsTo<UserAssignments, User>;
    Roles: BelongsToMany<UserAssignments, Role>;
  };
  
  async addRole(role: string) {
    await UserRole.create({ userId: this.id, role });
  }

  async removeRole(role: string) {
    await UserRole.destroy({ where: { userId: this.id, role } });
  }
}
UserAssignments.init(
  {
    id: {
      type: DataTypes.STRING(18),
      primaryKey: true,
    },
    nip: {
      type: DataTypes.STRING(18),
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [18, 18],
      },
    },
    nama: {
      type: DataTypes.STRING(125),
      allowNull: false,
    },
    kd_satker: {
      type: DataTypes.STRING(6),
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [6, 6],
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        minLength(value: string) {
          if (value && value.length < 6) {
            throw new Error("Password must be at least 6 characters");
          }
        },
        strongPassword(value: string) {
          if (
            value &&
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/.test(
              value
            )
          ) {
            throw new Error(
              "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            );
          }
        },
      },
    },
  },
  {
    sequelize,
    tableName: "user_assignments",
    modelName: "UserAssignments",
    timestamps: false,
    hooks: {
      afterValidate: async (user: UserAssignments) => {
        if (user.password) {
          user.password = await hash(user.password);
        }
      },

      beforeCreate: (data) => {
        data.id = UUID.v7();
      },
    },
    indexes: [
      {
        unique: true,
        fields: ["nip", "kode_satker"],
      },
    ],
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
  }
);

class UserRole extends Model<UserAssignmentsRoleAttributes> {
  public userId!: string;
  public kode!: string;
}

UserRole.init(
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    role: {
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
UserAssignments.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "userId",
  otherKey: "role",
  sourceKey: "id",
  targetKey: "kode",
  as: "Roles",
});
export default UserAssignments;
