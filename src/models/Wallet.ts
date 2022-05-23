import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';

export class WalletModel extends Model<InferAttributes<WalletModel>, InferCreationAttributes<WalletModel>> {
    declare id: CreationOptional<number>;
    declare disc_id: string;
    declare pkey: string;
    declare address: string;
    // createdAt can be undefined during creation
    declare createdAt: CreationOptional<Date>;
    // updatedAt can be undefined during creation
    declare updatedAt: CreationOptional<Date>;


}
export const walletCreation = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    disc_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pkey: {
        type: DataTypes.TEXT,
        allowNull: false,
        // allowNull defaults to true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}

