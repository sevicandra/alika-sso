import sequelize from "@/config/db.config";
import { Model, Optional, DataTypes } from "sequelize";
import { UUID } from "@/utils/uuid.util";

type ScopeActionAttributes = {
  id: string;
  kode: string;
  name: string;
  description: string;
};

type ScopeActionCreationAttributes = Optional<ScopeActionAttributes, "id">;

export class ScopeAction extends Model<ScopeActionAttributes, ScopeActionCreationAttributes> {
  declare id: string;
  declare kode: string;
  declare name: string;
  declare description: string;
}

ScopeAction.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUID.v7,
    },
    kode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "ScopeActions",
    tableName: "scope_actions",
    timestamps: false,
  }
);

export default ScopeAction;
