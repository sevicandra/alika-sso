import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/config/db.config";

type SessionAttributes = {
  sessionId: string;
  data: string;
  expires: Date;
};

export interface SessionInput extends Optional<SessionAttributes, "sessionId"> {}

export interface SessionOutput extends Required<SessionAttributes> {}

class Session extends Model<SessionAttributes, SessionInput> implements SessionAttributes {
  public sessionId!: string;
  public data!: string;
  public expires!: Date;
}

Session.init(
  {
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    data: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize, tableName: "sessions" }
);

export default Session;
