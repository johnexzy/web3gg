import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";

export class TokenModel extends Model<
  InferAttributes<TokenModel>,
  InferCreationAttributes<TokenModel>
> {
  declare id: CreationOptional<number>;
  declare disc_id: string;
  declare name: string;
  declare symbol: string;
  declare contract_address: string;
  declare decimals: number;
  declare network: string;
  declare chain_id: number;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  /**
   * wallet declares
   */
}
export const tokenCreation = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  disc_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
    // allowNull defaults to true
  },
  contract_address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  decimals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  network: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  chain_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
};
