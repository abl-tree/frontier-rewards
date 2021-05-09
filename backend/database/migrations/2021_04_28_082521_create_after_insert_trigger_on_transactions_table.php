<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAfterInsertTriggerOnTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared('
            CREATE TRIGGER after_insert_trigger_on_transactions AFTER INSERT ON `transactions` FOR EACH ROW
            BEGIN
            UPDATE users SET points=NEW.balance WHERE id=NEW.user_id;
            END');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::unprepared('DROP TRIGGER `after_insert_trigger_on_transactions`');
    }
}
