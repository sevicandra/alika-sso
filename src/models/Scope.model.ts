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
class Scope
  extends Model<ScopeAttributes, ScopeCreationAttributes>
  implements ScopeAttributes
{
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
    kode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scope: {
      type: DataTypes.STRING,
      allowNull: false,
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
    hooks: {
      beforeCreate: (data) => {
        data.id = UUID.v7();
      },
    },
    indexes: [
      {
        unique: true,
        fields: ["service_kode", "kode"],
      },
    ],
  }
);


export default Scope;
