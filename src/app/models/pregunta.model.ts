
export class Pregunta {


    constructor(

        public id: number,
        public test_id: number,
        public que_desc: string,
        public ans1: string,
        public ans2: string,
        public ans3: string,
        public ans4: string,
        public true_ans: number,
        public img_preg: string,
        public imgr1: string,
        public imgr2: string,
        public imgr3: string,
        public imgr4: string,
        public ban_img: number,
        public ban_imgr1: number,
        public ban_imgr2: number,
        public ban_imgr3: number,
        public ban_imgr4: number,
        public componente: number,
        public competencia: string,
        public que_desc2: string,
        public que_desc3: string,
        public pre_test: number,
        public estado: number,
        public user_id: number
    ) {

    }

}