import {DataTypes, type InferAttributes, type InferCreationAttributes, Model, Sequelize} from "sequelize";

export class Session extends Model<InferAttributes<Session>, InferCreationAttributes<Session>> {
    declare id: string;
    declare user: number;

}

export const init = (sequelize: Sequelize) => {
    Session.init({
        id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
        },
        user: {
            type: DataTypes.INTEGER,
        }
    }, {
        sequelize,
        tableName: "session",
    });
}
