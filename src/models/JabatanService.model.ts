import sequelize from "@/config/db.config";
import { Model, Optional, DataTypes, BelongsTo } from "sequelize";
import { UUID } from "@/utils/uuid.util";
import Service from "./Service.model";

type JabatanServiceAttributes = {
  id: string;
  service_kode: string;
  kode_satker: string;
  kode_organisasi: string;
  kode_jabatan: string;
  description: string;
};

type JabatanServiceCreationAttributes = Optional<JabatanServiceAttributes, "id">;

class JabatanService
  extends Model<JabatanServiceAttributes, JabatanServiceCreationAttributes>
  implements JabatanServiceAttributes
{
  public id!: string;
  public service_kode!: string;
  public kode_satker!: string;
  public kode_organisasi!: string;
  public kode_jabatan!: string;
  public description!: string;

  public Service!: Service;
  public static associations: {
    Service: BelongsTo<JabatanService, Service>;
  };
}

JabatanService.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: UUID.v7(),
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
    kode_satker: {
      type: DataTypes.STRING(6),
      allowNull: false,
      validate: {
        is: {
          msg: "Mohon masukkan kode satker yang valid",
          args: /^(\d{6}|-)$/,
        },
      },
      defaultValue: "-",
    },
    kode_organisasi: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        is: {
          msg: "Mohon masukkan kode organisasi yang valid",
          args: /^(\d{1,20})$/,
        },
      },
    },
    kode_jabatan: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        is: {
          msg: "Mohon masukkan kode jabatan yang valid",
          args: /^(\d{1,20})$/,
        },
      },
    },
    description: {
      type: DataTypes.STRING(125),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "JabatanServices",
    tableName: "jabatan_services",
    timestamps: false,
  }
);

export default JabatanService;
