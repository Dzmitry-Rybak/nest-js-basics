import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessageRepository } from './messages.repository';

@Module({
  controllers: [MessagesController],
  // after we add this service and repository in providers array, we can use them in controller
  providers: [MessageRepository, MessagesService], // things that can be used as dependencies for other classes
})
export class MessagesModule {}
