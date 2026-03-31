import sequelize from "@/config/db.config";
import { Model, Optional, DataTypes, BelongsTo, BelongsToMany } from "sequelize";
import User from "./User.model";
import Role from "./Role.model";
import Service from "./Service.model";
import UserRole from "./UserRole.model";
import { UUID } from "@/utils/uuid.util";

type UserAssignmentsAttributes = {
  id: string;
  nip: string;
  nama: string;
  kd_satker: string;
  service_kode: string;
};

type UserAssignmentsCreationAttributes = Optional<UserAssignmentsAttributes, "id" | "kd_satker">;
export class UserAssignments
  extends Model<UserAssignmentsAttributes, UserAssignmentsCreationAttributes>
  implements UserAssignmentsAttributes
{
  public id!: string;
  public nip!: string;
  public kd_satker!: string;
  public nama!: string;
  public service_kode!: string;

  public Roles!: Role[] | [];
  public UserInfo!: User | null;
  public Service!: Service;

  async addRole(role: string) {
    await UserRole.create({ user_id: this.id, role_kode: role });
  }

  async removeRole(role: string) {
    await UserRole.destroy({ where: { user_id: this.id, role_kode: role } });
  }

  public static associations: {
    User: BelongsTo<UserAssignments, User>;
    Roles: BelongsToMany<UserAssignments, Role>;
    Service: BelongsTo<UserAssignments, Service>;
  };
}
UserAssignments.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUID.v7(),
      primaryKey: true,
    },
    nip: {
      type: DataTypes.STRING(18),
      allowNull: false,
      validate: {
        is: {
          args: "^(19[6-9]\\d|20\\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\\d|3[0-1])(19[8-9]\\d|20\\d{2})(0[1-9]|1[0-2])([1-2])(\\d{3})$",
          msg: "mohon masukkan nip yang valid",
        },
        notNull: {
          msg: "NIP harus diisi",
        },
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
        is: {
          msg: "Mohon masukkan kode satker yang valid",
          args: "^(d{6}|-)$",
        },
      },
      defaultValue: "-",
    },
    service_kode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      references: {
        model: "Services",
        key: "kode",
      },
      validate: {
        notNull: {
          msg: "Service harus diisi",
        },
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
  },
  {
    sequelize,
    tableName: "user_assignments",
    modelName: "UserAssignments",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["nip", "kode_satker", "service_kode"],
      },
    ],
  }
);

export default UserAssignments;
