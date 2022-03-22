export const sRateJsonSchema = {
    properties: {
        country: {type: "string"},
        year: {type: "int16"},
        suicide_no: {type: "int16"},
        population: {type: "float32"}
    },
    optionalProperties: {
        id: {type: "string"},
        sex: {type: "string"},
        age: {type: "string"},
        suicides100k_pop: {type: "float32"},
        countryyear: {type: "string"}
    }
}