import { Role } from "./role.model";

export class Usuario {


    constructor(

        public id: number,
        public tipo_doc_id: number,
        public identificacion: string,
        public name: string,
        public email: string,
        public username: string,
        public password: string,
        public curso_id: number,
        public departamento_id: number,
        public municipio_id: number,
        public role_id: number,
        public grado_id: number,
        public tipo: string,
        public telefono?: string,
        public direccion?: string,
        public estado?: number,
        public codigo?: string,
        public jornada?: string,
        public fecha_nacimiento?: Date,
        public user_id?: number,
        public foto?: string,
        public genero?: string,
        public rol?: Role,
    ) {

    }

}