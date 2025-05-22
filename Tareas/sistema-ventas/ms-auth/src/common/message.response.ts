import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse {
  @ApiProperty({
    required: true,
    type: Boolean,
    description: 'Status response'
  })
  status: boolean;

  @ApiProperty({
    required: true,
    type: Number,
    description: 'Status code of response'
  })
  statusCode: number;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Message of response',
  })
  message: string;

  @ApiProperty({
    required: false,
    type: Object,
    description: 'Data of response'
  })
  data?: any;

  @ApiProperty({
    required: false,
    type: Object,
    description: 'Error'
  })
  error?: any;

  constructor(response :{status: boolean, statusCode: number, message: string, data?: any}) {
    this.status = response.status
    this.statusCode = response.statusCode;
    this.message = response.message;
    this.data = response.data;
  }
}
