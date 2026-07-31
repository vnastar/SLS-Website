<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('click_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('short_link_id')->constrained('short_links')->cascadeOnDelete();
            $table->string('ip_address', 45)->nullable()->index();
            $table->string('country_code', 2)->nullable()->index();
            $table->string('city')->nullable();
            $table->string('device', 32)->nullable()->index(); // mobile, desktop, tablet, bot
            $table->string('os', 32)->nullable();
            $table->string('browser', 32)->nullable();
            $table->text('referer')->nullable();
            $table->boolean('is_crawler')->default(false)->index();
            $table->timestamp('created_at')->useCurrent()->index();

            $table->index(['short_link_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('click_logs');
    }
};
