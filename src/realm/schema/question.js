'use strict';

import Realm from 'realm';
export const QUESTION_SCHEMA = 'Question';
export const PRELOAD_SCHEMA = 'Preload';
class Question extends Realm.Object {}

Question.schema = {
    name: QUESTION_SCHEMA,
    primaryKey: '_id',
    properties: {
        _id: {
            type: 'string',
            optional: true
        },
        question: {
            type: 'string',
            optional: true
        },
        roadmapSkill: {
            type: 'string',
            optional: true
        },
        category: {
            type: 'string',
            optional: true
        },
        subCategory: {
            type: 'string',
            optional: true
        },
        description: {
            type: 'string',
            optional: true
        },
        conditions: {
            type: 'string',
            optional: true
        },
        evaluation: {
            type: 'string',
            optional: true
        },
        complexity: {
            type: 'string',
            optional: true
        },
        type: {
            type: 'string',
            optional: true
        },
        answers: {
            type: 'string[]',
            optional: true
        },
        correctAnswers: {
            type: 'string[]',
            optional: true
        },
        preLoad: {
            type: 'Preload[]',
            default: []
        },
    }

};

export default Question;
