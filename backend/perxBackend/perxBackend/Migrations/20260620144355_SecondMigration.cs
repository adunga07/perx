using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace perxBackend.Migrations
{
    /// <inheritdoc />
    public partial class SecondMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tags_Categories_CategoryId",
                table: "Tags");

            migrationBuilder.DropIndex(
                name: "IX_Tags_CategoryId",
                table: "Tags");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Tags");

            migrationBuilder.RenameColumn(
                name: "Availability",
                table: "Perxes",
                newName: "Used");

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "Perxes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PerxCategoryId",
                table: "Perxes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Perxes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Perxes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Perxes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ActiveOffers",
                table: "Businesses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Businesses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Instagram",
                table: "Businesses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "Rating",
                table: "Businesses",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Revenue",
                table: "Businesses",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "Website",
                table: "Businesses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "CategoryBusinesses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    BusinessId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryBusinesses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CategoryBusinesses_Businesses_BusinessId",
                        column: x => x.BusinessId,
                        principalTable: "Businesses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CategoryBusinesses_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TagCategorys",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    TagId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TagCategorys", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TagCategorys_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TagCategorys_Tags_TagId",
                        column: x => x.TagId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Perxes_CategoryId",
                table: "Perxes",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Perxes_PerxCategoryId",
                table: "Perxes",
                column: "PerxCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_CategoryBusinesses_BusinessId",
                table: "CategoryBusinesses",
                column: "BusinessId");

            migrationBuilder.CreateIndex(
                name: "IX_CategoryBusinesses_CategoryId",
                table: "CategoryBusinesses",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_TagCategorys_CategoryId",
                table: "TagCategorys",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_TagCategorys_TagId",
                table: "TagCategorys",
                column: "TagId");

            migrationBuilder.AddForeignKey(
                name: "FK_Perxes_Categories_CategoryId",
                table: "Perxes",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Perxes_Categories_PerxCategoryId",
                table: "Perxes",
                column: "PerxCategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Perxes_Categories_CategoryId",
                table: "Perxes");

            migrationBuilder.DropForeignKey(
                name: "FK_Perxes_Categories_PerxCategoryId",
                table: "Perxes");

            migrationBuilder.DropTable(
                name: "CategoryBusinesses");

            migrationBuilder.DropTable(
                name: "TagCategorys");

            migrationBuilder.DropIndex(
                name: "IX_Perxes_CategoryId",
                table: "Perxes");

            migrationBuilder.DropIndex(
                name: "IX_Perxes_PerxCategoryId",
                table: "Perxes");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Perxes");

            migrationBuilder.DropColumn(
                name: "PerxCategoryId",
                table: "Perxes");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Perxes");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Perxes");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Perxes");

            migrationBuilder.DropColumn(
                name: "ActiveOffers",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "Instagram",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "Revenue",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "Website",
                table: "Businesses");

            migrationBuilder.RenameColumn(
                name: "Used",
                table: "Perxes",
                newName: "Availability");

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "Tags",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Tags_CategoryId",
                table: "Tags",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tags_Categories_CategoryId",
                table: "Tags",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
