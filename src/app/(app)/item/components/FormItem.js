const FormItem = () => {
    return (
        <form>
            <div className="lg:col-span-2">
                <div className="grid gap-4 gap-y-4 text-sm sm:grid-cols-5 md:grid-cols-5">
                    <div class="md:col-span-5">
                        <label for="name">Kode Item</label>
                        <input type="text" name="code" id="code" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" autocomplete="false" />
                    </div>

                    <div class="md:col-span-5">
                      <label for="uom">Satuan</label>
                      <select id="uom" name="uom" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50">
                          <option value="">----------</option>
                          <option value="PCS">PCS</option>
                          <option value="PACK">PACK</option>
                          <option value="KG">KG</option>
                      </select>
                    </div>

                    <div class="md:col-span-5">
                        <label for="uom">Kategori</label>
                        <select id="uom" name="uom" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50">
                            <option value="">----------</option>
                            <option value="Pakan">Pakan</option>
                            <option value="Vaksin">Vaksin</option>
                            <option value="Obat">Obat</option>
                            <option value="Material">Material</option>
                        </select>
                    </div>

                    <div class="md:col-span-5">
                        <label for="name">Keterangan</label>
                        <textarea className="h-30 border mt-1 rounded px-4 w-full bg-gray-50">
                        </textarea>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default FormItem;
                    