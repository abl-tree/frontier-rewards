<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToUserRewardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_rewards', function (Blueprint $table) {
            $table->decimal('multiplier')->default(0)->after('reward_type');
            $table->decimal('o_reward_quantity')->default(0)->before('reward_qty');
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
            $table->dropColumn('multiplier');
            $table->dropColumn('o_reward_quantity');
        });
    }
}
