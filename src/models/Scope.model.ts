import sequelize from "@/config/db.config";
import { Model, Optional, DataTypes, BelongsTo } from "sequelize";
import { UUID } from "@/utils/uuid.util";
import Service from "./Service.model";

type ScopeAttributes = {
  id: string;
  kode: string;
  scope: string;
  service_kode: string;
};
type ScopeCreationAttributes = Optional<ScopeAttributes, "id">;
class Scope extends Model<ScopeAttributes, ScopeCreationAttributes> implements ScopeAttributes {
  public id!: string;
  public kode!: string;
  public scope!: string;
  public service_kode!: string;

  public Service!: Service;
  public static associations: {
    Service: BelongsTo<Scope, Service>;
  };
}

Scope.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUID.v7,
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
    kode: {
      type: DataTypes.STRING,
      allowNull: false,
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
    scope: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Nama harus diisi",
        },
      },
    },
  },
  {
    sequelize,
    tableName: "scopes",
    timestamps: false,
    modelName: "Scope",
    defaultScope: {
      order: [["kode", "ASC"]],
      include: [
        {
          association: "Service",
          attributes: ["kode", "name"],
        },
      ],
    },
    indexes: [
      {
        unique: true,
        fields: ["service_kode", "kode"],
        name: "kode",
      },
    ],
  }
);

export default Scope;
