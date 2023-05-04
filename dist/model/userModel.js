"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        allowNull: false,
        unique: true
    },
    fullName: {
        type: String,
        primaryKey: true,
        allowNull: false
    },
    phone: {
        type: String,
        allowNull: false,
        unique: true
    },
    gender: {
        type: String,
        allowNull: false
    },
    address: {
        type: String,
        allowNull: false,
    },
    password: {
        type: String,
        allowNull: false
    }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.userId = ret._id,
                delete ret._id,
                delete ret.password,
                delete ret.__v;
        }
    }
});
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
