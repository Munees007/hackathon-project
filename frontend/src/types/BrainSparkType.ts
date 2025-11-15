export type code_snip = {
    code:string,
    options:string[],
    output?:string,
    answer?:string
}

export type logic_riddle = {
    question:string,
    options:string[],
    answer?:string
}

export type map_algorithm = {
    algorithm:string[],
    correctOrder?:string[]
}
export type QuestionType = "code_snip" | "logic_riddle" | "map_algorithm";

export type QuestionItem = {
  id: string;
  type: QuestionType;
  addedBy: string;
  question?: string;
  options?: string[];
  output?: string;
  algorithm?: string[];
  correctOrder?: string[];
};