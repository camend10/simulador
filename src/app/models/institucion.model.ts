
export class Institucion {


    constructor(

        public id: number,
        public codigo: string,
        public nit: string,
        public nombre: string,
        public email: string,
        public departamento_id: number,
        public municipio_id: number,
        public telefono?: string,
        public direccion?: string,
        public estado?: number,
        public user_id?: number,
        public foto?: string,
    ) {

    }

}