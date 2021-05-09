<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterColumnsToUserRewardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_rewards', function (Blueprint $table) {
            $table->dropForeign(['transaction_id']);
            $table->dropColumn('transaction_id');
            $table->unsignedBigInteger('transaction_item_id')->after('id');
            $table->foreign('transaction_item_id')->references('id')->on('transaction_items');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_rewards', function (Blueprint $table) {
            $table->dropForeign(['transaction_item_id']);
            $table->dropColumn('transaction_item_id');
            $table->unsignedBigInteger('transaction_id')->after('id');
            $table->foreign('transaction_id')->references('id')->on('transactions');
        });
    }
}
