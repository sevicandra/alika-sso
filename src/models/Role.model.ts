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

type RoleCreationAttributes = Optional<
  RoleAttributes,
  "id" | "description"
>;

class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
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
    service_kode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      references: {
        model: Service,
        key: "kode",
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
    hooks: {
      beforeCreate: (data) => {
        data.id = UUID.v7();
      },
    },
  }
);

export default Role;
