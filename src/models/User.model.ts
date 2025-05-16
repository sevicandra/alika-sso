import sequelize from "@/config/db.config";
import { Model, Optional, DataTypes, HasMany } from "sequelize";
import UserAssignments from "./UserAssignments.model";
import GlobalRole from "./GlobalRole.model";
import { UUID } from "@/utils/uuid.util";
type UserGlobalRoleAttributes = {
  userId: string;
  role: string;
};
class UserGlobalRole extends Model<UserGlobalRoleAttributes> {
  public userId!: string;
  public kode!: string;
}

UserGlobalRole.init(
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
    tableName: "user_global_roles",
    modelName: "UserGlobalRole",
    timestamps: false,
  }
);

type UserAttributes = {
  id: string;
  sub: string;
  name: string;
  kode_kl: string;
  nama_kl: string;
  nip: string;
  jabatan: string;
  jenis_jabatan: string;
  kode_organisasi: string;
  organisasi: string;
  kode_satker: string;
  satker: string;
  gravatar: string;
  preferred_username: string;
  email: string;
  npwp: string;
  nik: string;
};

type UserCreationAttributes = Optional<UserAttributes, "sub" | "id">;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public sub!: string;
  public userId!: string;
  public name!: string;
  public kode_kl!: string;
  public nama_kl!: string;
  public nip!: string;
  public jabatan!: string;
  public jenis_jabatan!: string;
  public kode_organisasi!: string;
  public organisasi!: string;
  public kode_satker!: string;
  public satker!: string;
  public gravatar!: string;
  public preferred_username!: string;
  public email!: string;
  public npwp!: string;
  public nik!: string;

  public UserAssignments!: UserAssignments[] | [];
  public GlobalRoles!: GlobalRole[] | [];

  public static associations: {
    UserAssignments: HasMany<User, UserAssignments>;
    GlobalRoles: HasMany<User, GlobalRole>;
  };

  async addRole(role: string) {
    await UserGlobalRole.create({ userId: this.sub, role });
  }

  async removeRole(role: string) {
    await UserGlobalRole.destroy({ where: { userId: this.sub, role } });
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: true,
      primaryKey: true,
    },
    sub: {
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kode_kl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_kl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nip: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jabatan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jenis_jabatan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kode_organisasi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organisasi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kode_satker: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    satker: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gravatar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preferred_username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    npwp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nik: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    modelName: "User",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["nip"],
      },
    ],
    hooks: {
      beforeCreate: (data) => {
        data.sub = UUID.v7();
        data.id = UUID.v7();
      },
    },
  }
);

User.hasMany(UserAssignments, {
  foreignKey: "nip",
  sourceKey: "nip",
  as: "Users",
});
UserAssignments.belongsTo(User, {
  foreignKey: "nip",
  targetKey: "nip",
  as: "User",
});
User.belongsToMany(GlobalRole, {
  through: UserGlobalRole,
  foreignKey: "userId",
  otherKey: "role",
  sourceKey: "sub",
  targetKey: "kode",
  as: "GlobalRoles",
});
GlobalRole.belongsToMany(User, {
  through: UserGlobalRole,
  foreignKey: "role",
  otherKey: "userId",
  sourceKey: "role",
  targetKey: "sub",
  as: "Users",
});

export default User;
