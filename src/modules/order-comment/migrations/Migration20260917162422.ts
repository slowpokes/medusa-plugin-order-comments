import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260917162422 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "order_comment" ("id" text not null, "order_id" text not null, "content" text not null, "author_id" text not null, "author_email" text not null, "author_first_name" text null, "author_last_name" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "order_comment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_order_comment_author_id" ON "order_comment" ("author_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_order_comment_deleted_at" ON "order_comment" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_order_comment_order_created_at" ON "order_comment" ("order_id", "created_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "order_comment" cascade;`);
  }

}
