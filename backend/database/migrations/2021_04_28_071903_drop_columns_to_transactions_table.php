<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropColumnsToTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['action_id']);
            $table->dropColumn('action_id');
            $table->dropColumn('action_name');
            $table->dropForeign(['campaign_id']);
            $table->dropColumn('campaign_id');
            $table->dropColumn('campaign_name');
            $table->unsignedBigInteger('transaction_item_id')->after('transaction_id');
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
        Schema::table('transactions', function (Blueprint $table) {            
            $table->unsignedBigInteger('action_id')->nullable();
            $table->foreign('action_id')->references('id')->on('actions');
            $table->string('action_name');
            $table->unsignedBigInteger('campaign_id')->nullable();
            $table->foreign('campaign_id')->references('id')->on('actions');
            $table->string('campaign_name');
            $table->dropForeign(['transaction_item_id']);
            $table->dropColumn('transaction_item_id');
        });
    }
}
