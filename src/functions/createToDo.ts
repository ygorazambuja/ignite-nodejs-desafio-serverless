import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidV4 } from "uuid";

import { document } from "../utils/dynamodbClient";

interface ICreateToDo {
  title: string;
  deadline: string;
}

interface ITemplate {
  id: string;
  user_id: string;
  title: string;
  done: boolean;
  deadline: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateToDo;
  const id = uuidV4();

  const todo: ITemplate = {
    id: String(id),
    user_id: userid,
    title,
    done: false,
    deadline: new Date(deadline).toISOString()
  }

  await document.put({
    TableName: "todos",
    Item: todo
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "To do created successfully!",
      todo: todo,
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }
}