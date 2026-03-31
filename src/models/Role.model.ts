import sequelize from "@/config/db.config";
import { Model, Optional, DataTypes, BelongsTo } from "sequelize";
import Service from "./Service.model";
import { UUID } from "@/utils/uuid.util";

type RoleAttributes = {
  id: string;
  kode: string;
  role: string;
  service_kode: string;
  description: string;
};

type RoleCreationAttributes = Optional<RoleAttributes, "id" | "description">;

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: string;
  public kode!: string;
  public role!: string;
  public description!: string;
  public service_kode!: string;

  public Service!: Service;
  public static associations: {
    Service: BelongsTo<Role, Service>;
  };
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUID.v7(),
    },
    kode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: {
        name: "kode",
        msg: "Kode sudah digunakan",
      },
      validate: {
        notNull: {
          msg: "Kode harus diisi",
        },
        is: {
          args: /^[0-9]{3}$/,
          msg: "Kode tidak valid",
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Role harus diisi",
        },
      },
    },
    service_kode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      references: {
        model: Service,
        key: "kode",
      },
      validate: {
        notNull: {
          msg: "Kode harus diisi",
        },
        is: {
          args: /^[0-9]{3}$/,
          msg: "Kode tidak valid",
        },
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Roles",
    tableName: "roles",
    timestamps: false,
  }
);

export default Role;
