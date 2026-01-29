import sequelize from "@/config/db.config";
import { Model, Optional, DataTypes, HasMany } from "sequelize";
import Role from "./Role.model";
import Scope from "./Scope.model";
import { UUID } from "@/utils/uuid.util";
type ServiceAttributes = {
  id: string;
  kode: string;
  name: string;
  description: string;
};

type ServiceCreationAttributes = Optional<ServiceAttributes, "id">;

class Service
  extends Model<ServiceAttributes, ServiceCreationAttributes>
  implements ServiceAttributes
{
  public id!: string;
  public kode!: string;
  public name!: string;
  public description!: string;
  public Roles!: Role[];
  public Scopes!: Scope[];

  public static associations: {
    Roles: HasMany<Service, Role>;
    Scopes: HasMany<Service, Scope>;
  };

  async addRole({ kode, role, description }: { kode: string; role: string; description?: string }) {
    await Role.create({ service_kode: this.kode, kode, role, description });
    return this.Roles;
  }

  async removeRole(id: string) {
    await Role.destroy({
      where: {
        service_kode: this.kode,
        id,
      },
    });

    return this.Roles;
  }

  async addScope({ kode, name }: { kode: string; name: string }) {
    await Scope.create({
      service_kode: this.kode,
      kode,
      scope: name,
    });
    return this.Scopes;
  }

  async removeScope(id: string) {
    await Scope.destroy({
      where: {
        service_kode: this.kode,
        id,
      },
    });
  }
}

Service.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Nama harus diisi",
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Services",
    tableName: "services",
    timestamps: false,
    hooks: {
      beforeCreate: (data) => {
        data.id = UUID.v7();
      },
    },
  }
);

export default Service;
